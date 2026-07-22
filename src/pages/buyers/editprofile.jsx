import { useEffect, useState } from "react";
import "../../App.css";
import profileimg from "../../assets/images/profile.png";
import BuyerHeader from "../../component/buyers/buyer-header";
import { useBuyerProfileContext } from "../../context/buyerProfileContextCore";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();

  const { buyerProfile, UpdatedHandler } = useBuyerProfileContext();

  const [updateBuyer, setUpdateBuyer] = useState({
    _id: "",
    username: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (buyerProfile) {
      setUpdateBuyer(buyerProfile);
    }
  }, [buyerProfile]);

  const formHandler = (e) => {
    const { name, value } = e.target;

    setUpdateBuyer((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const SubmitHandler = async (e) => {
    e.preventDefault();

    try {
      await UpdatedHandler(updateBuyer);

      alert("Profile Updated Successfully");

      navigate("/buyers/profile");
    } catch (err) {
      alert(err.message || "Failed to update profile");
    }
  };



  return (
    <>
      <BuyerHeader />

      <section className="buyerprofile editprofile">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <h3>Edit Profile</h3>

              <div className="profilerow">
                <img
                  src={profileimg}
                  alt="profile"
                  className="img-fluid"
                />

                <div className="profileinfo">
                  <form onSubmit={SubmitHandler}>
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        name="username"
                        className="form-control"
                        value={updateBuyer.username}
                        onChange={formHandler}
                      />
                    </div>

                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={updateBuyer.email}
                        disabled
                      />
                    </div>

                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="text"
                        name="phone"
                        className="form-control"
                        value={updateBuyer.phone}
                        onChange={formHandler}
                      />
                    </div>

                    <div className="form-group">
                      <label>Address</label>
                      <input
                        type="text"
                        name="address"
                        className="form-control"
                        value={updateBuyer.address}
                        onChange={formHandler}
                      />
                    </div>

                    <div className="update_deletebtn">
                      <button className="custom_btn" type="submit">
                        Save Profile
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default EditProfile;