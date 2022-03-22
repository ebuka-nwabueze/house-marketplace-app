import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { db } from "../firebase.config";

function Contact() {
  const [message, setMessage] = useState("");
  const [landlord, setLandlord] = useState(null);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useParams();
  const navigate = useNavigate()

  useEffect(() => {
    const getLandlord = async () => {
      const docRef = doc(db, "users", params.landlordId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setLandlord(docSnap.data());
        setLoading(false);
      } else {
        // doc.data() will be undefined in this case
        toast.error("Landlord data not found");
      }
    };

    getLandlord();
    return () => {};
  }, [params.landlordId]);

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  const onSendMessage = (e) => {
    setMessage("")
    toast.success("Please check the opened tab for email")
    navigate(-1)
  }

  if (loading) return <Spinner />;

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Contact Landlord</p>
      </header>
      {landlord !== null && (
        <main>
          <div className="contactladlord">
            <p className="landlordName">{landlord?.name}</p>
          </div>

          <form className="messageForm">
            <div className="messageDiv">
              <label htmlFor="message" className="message">
                Message
              </label>
              <textarea
                name="message"
                id="message"
                className="textarea"
                value={message}
                onChange={onChange}
              ></textarea>
            </div>

            <a
              href={`mailto:${landlord.email}?Subject=${searchParams.get(
                "listingName"
              )}&body=${message}`}
              target="_blank"
              rel="noreferrer"
            ><button onClick={onSendMessage} type="button" className="primaryButton">Send Message</button></a>
          </form>
        </main>
      )}
    </div>
  );
}

export default Contact;
