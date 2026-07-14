import { Link } from "react-router-dom";
import "../../App.css";
import profileimg from "../../assets/images/profile.png";
import BuyerHeader from "../../component/buyers/buyer-header";
import { useBuyerProfileContext } from "../../context/BuyerProfileContext";
import { useNavigate } from "react-router-dom";



const BuyerProfile = () => {
  const { buyerProfile, loading , DeleteHandler} = useBuyerProfileContext();
  const navigate = useNavigate();
  const handleDelete = async () => {
  await DeleteHandler(buyerProfile?._id);
  navigate("/buyers/login");
};
  if (loading) {
    return <h2>Loading...</h2>;
  }
  return (
    <>
      <BuyerHeader />
      <section className="buyerprofile">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <h3>My Profile</h3>
              <div className="profilerow">
                <img
                  src={profileimg}
                  alt="profileimage"
                  className="img-fluid"
                />
                <ul className="profileinfo">
                  <li>
                    <label>Full Name</label>
                    <p>{buyerProfile?.username}</p>
                  </li>
                  <li>
                    <label>Email</label>
                    <p>{buyerProfile?.email}</p>
                  </li>
                  <li>
                    <label>Phone</label>
                    <p>{buyerProfile?.phone}</p>
                  </li>
                  <li>
                    <label>Address</label>
                    <p>{buyerProfile?.address}</p>
                  </li>
                  <div className="update_deletebtn">
                    <Link to="/buyers/profile/edit" className="custom_btn">Edit Profile</Link>
                    <button className="custom_btn" onClick={handleDelete}>Delete</button>
                  </div>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BuyerProfile;
