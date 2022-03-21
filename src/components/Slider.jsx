import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SwiperCore, { Navigation, Pagination, A11y, Scrollbar } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import "swiper/swiper-bundle.css";
import Spinner from "../components/Spinner";
import { db } from "../firebase.config";

function Slider() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      const listingsRef = collection(db, "listings");
      const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5));
      const docSnap = await getDocs(q);

      let listing = [];

      docSnap.forEach((doc) => {
        return listing.push({
          id: doc.id,
          data: doc.data()
        })
      });
      setListings(listing)
      setLoading(false)
    };

    fetchListing();
  }, []);

  if(loading) return <Spinner/>
  
  return  listings && (
    <>
     <p className="exploreHeading">Recommended</p>

     <Swiper slidesPerView={1} pagination={{ clickable: true }}>
        {listings.map(({id, data}) => (
          <SwiperSlide key={id} onClick={() => {
            navigate(`/category/${data.type}/${id}`)
          }}>
            <div
              style={{
                backgroundSize: "cover",
                background: `url(${data.imgUrls[0]}) center no-repeat`,
              }}
              className="swiperSlideDiv"
            >
              <p className="swiperSlideText">{data.name}</p>
              <p className="swiperSlidePrice">
                ${data.discountedPrice ?? data.regularPrice}
                {data.type === "rent" && " / Month"}
              </p>
            
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}

export default Slider;
