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

function Category() {
  const [listing, setListing] = useState(null);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    const getListing = async () => {
      try {
        // get a query reference
        const q = query(
          collection(db, "listings"),
          where("type", "==", params.categoryName),
          orderBy("timestamp", "desc"),
          limit(10)
        );
        // create snapshot for the database
        const querySnapshot = await getDocs(q);

        
        // Geting the last listing on the initial request
        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
         setLastFetchedListing(lastVisible)

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
  }, [params.categoryName]);

  const onFetchMoreListing = async () => {
    try {
      // get a query reference
      const q = query(
        collection(db, "listings"),
        where("type", "==", params.categoryName),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedListing),
        limit(10)
      );
      // create snapshot for the database
      const querySnapshot = await getDocs(q);
      
      // Geting the last listing on the initial request
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
       setLastFetchedListing(lastVisible)

      // saving the returned list
      const fetchedList = [];
      querySnapshot.forEach((doc) => {
        return fetchedList.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      // update state hook with list
      setListing((prevState)=> [...prevState, ...fetchedList]);
      setLoading(false);
    } catch (error) {
      toast.error("Unable to fetch listings");
    }
  };

  return (
    <div className="category">
      <header>
        <p className="pageHeader">
          {params.categoryName === "sale"
            ? "Places for Sale"
            : "Places for Rent"}
        </p>
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

          <br/>
          <br/>
          {lastFetchedListing && (
            <p className="loadMore" onClick={()=> onFetchMoreListing()}>Load More</p>
          )}
        </>
      ) : (
        <p> No listings for {params.categoryName}</p>
      )}
    </div>
  );
}

export default Category;
