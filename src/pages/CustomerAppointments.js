import React from "react";
import AppointmentsTable from "../components/AppointmentsTable";

const CustomerAppointments = ({
    appointments,
    handleViewDetails,
    handleReviewClick,
    handleSearch,
    statusFilter,
    fromDate,
    toDate,
    setStatusFilter,
    setFromDate,
    setToDate,
    loading
}) => {

    return (
        <div className="customer-appointments-content">
            
            {/* Search Form */}
            <div className="mt-5 border rounded p-3 bg-light">
                <h5 className="mb-3">Search Appointments</h5>
                <div className="row g-3">
                    <div className="col-md-3">
                        <label>Status</label>
                        <select
                            className="form-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">All</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="completed">Completed</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label>From Date</label>
                        <input
                            type="date"
                            className="form-control"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                        />
                    </div>
                    <div className="col-md-3">
                        <label>To Date</label>
                        <input
                            type="date"
                            className="form-control"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                        />
                    </div>
                    <div className="col-md-3 d-flex align-items-end">
                        <button className="btn btn-primary w-100" onClick={handleSearch}>
                            Search
                        </button>
                    </div>
                </div>
            </div>

            {/* Appointment List */}
            <h5 className="mt-4">My Appointments ({appointments.length} results)</h5>
            
            {loading ? (
                <p>Loading appointments...</p>
            ) : appointments.length > 0 ? (
                <AppointmentsTable 
                    appointments={appointments}
                    role="customer"
                    onView={handleViewDetails} 
                    onReview={handleReviewClick} 
                />
            ) : (
                <p className="text-muted">You have no appointments this week.</p>
            )}
        </div>
    );
};

export default CustomerAppointments;