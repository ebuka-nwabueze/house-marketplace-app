import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ListingItem from "../components/ListingItem";
import Spinner from "../components/Spinner";
import { db } from "../firebase.config";

function Offer() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    const getListing = async () => {
      try {
        // get a query reference
        const q = query(
          collection(db, "listings"),
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(10)
        );
        // create snapshot for the database
        const querySnapshot = await getDocs(q);
        // saving the returned list
        const fetchedList = [];
        querySnapshot.forEach((doc) => {
          return fetchedList.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        // update state hook with list
        setListing(fetchedList);
        setLoading(false);
      } catch (error) {
        toast.error("Unable to fetch listings");
      }
    };

    getListing();
  }, []);

  return (
    <div className="category">
      <header>
        <p className="pageHeader">Offers</p>
      </header>

      {loading ? (
        <Spinner />
      ) : listing && listing.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
              {listing.map((listing) => (
                <ListingItem
                  listing={listing.data}
                  id={listing.id}
                  key={listing.id}
                />
              ))}
            </ul>
          </main>
        </>
      ) : (
        <p> No offers available</p>
      )}
    </div>
  );
}

export default Offer;
