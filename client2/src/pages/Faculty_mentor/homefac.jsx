import React, { useState } from "react";


// Dummy data to simulate the list items
const currentInternships = [
  { id: 1, name: 'John Doe', type: 'Marketing', status: 'In Progress', submitted: '1 day ago', img: 'https://lh3.googleusercontent.com/a/ACg8ocJ59g-2SS5abCne73PIrc-7RFj2FjC2vNxi1rui2GIc=s96-c' },
  // Add more current internship statuses here
];

const internshipsForApproval = [
  { id: 2, name: 'Jane Smith', type: 'Finance', status: 'Pending Approval', submitted: '3 days ago', img: 'https://lh3.googleusercontent.com/a/ACg8ocJ59g-2SS5abCne73PIrc-7RFj2FjC2vNxi1rui2GIc=s96-c' },
  { id: 3, name: 'Alex Johnson', type: 'Design', status: 'Pending Approval', submitted: '5 days ago', img: 'https://lh3.googleusercontent.com/a/ACg8ocJ59g-2SS5abCne73PIrc-7RFj2FjC2vNxi1rui2GIc=s96-c' },
  // Add more internships pending approval here
];

const InternshipPlatform = () => {
  // Function to handle internship approval
  const approveInternship = (internshipId) => {
    console.log(`Internship with ID ${internshipId} approved.`);
    // Here you would typically call a backend service to update the internship status
  };

  return (
    
    <div className="internship-platform">    
    
      <main className="main-content">
        {/* Current Internship Statuses */}
        <div className="status-list">
          <h2>Current Status</h2>
          {currentInternships.map((internship) => (
            <InternshipItem key={internship.id} internship={internship} />
          ))}
        </div>

        {/* New Internship Approvals */}
        <div className="approval-list">
          <h2>New Internship Approvals</h2>
          {internshipsForApproval.map((internship) => (
            <InternshipItem key={internship.id} internship={internship} withApprovalButton={true} onApprove={() => approveInternship(internship.id)} />
          ))}
        </div>
      </main>
    </div>
  );
};

const InternshipItem = ({ internship, withApprovalButton, onApprove }) => {
  return (
    <div className="internship-item">
      <img src={internship.img} alt="Internship Icon" className="internship-icon" />
      <div className="internship-info">
        <div className="internship-name">{internship.name}</div>
        <div className="internship-type">{internship.type} Internship</div>
        <div className="internship-status">Status: {internship.status}</div>
        <div className="internship-submitted">Submitted: {internship.submitted}</div>
      </div>
      {withApprovalButton && (
        <button className="approve-btn" onClick={onApprove}>
          Approve
        </button>
      )}
    </div>
  );
};

export default InternshipPlatform;
