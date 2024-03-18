import React from 'react'
import './Profile.scss'

const userDetails = [
    {

      label: "Name",
      value: "Siddharth Singh"
    },
    {

      label: "Email",
      value: "siddharth@example.com"
    },
    {

      label: "Department",
      value: "IT"
    },
    {

      label: "Semester",
      value: "8"
    },
    {
      label: "Contact No",
      value: "+1 234 567 8900"
    },
    {
      label: "Mentor",
      value: "Jane Doe"
    }
  ];
  const Header = () => {
    return (
      <header className="page-header">
        <h1 className="page-title">Profile</h1>
      </header>
    );
  }

  const Activity = ({ icon, label, value }) => {
    return (
        
      <div className="activity">
        <span className="activity-name">{label}:</span>
        <span className="index">{value}</span>
      </div>
    );
  }
  
  const Profile = () => {
    return (

      <div className="card">
         <Header />
        
        {userDetails.map((detail, index) => (
          <h3><Activity key={index} icon={detail.icon} label={detail.label} value={detail.value} /></h3>
        ))}
      </div>
    );
  }
  
  export default Profile;
  