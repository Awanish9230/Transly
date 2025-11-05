import MeetingCard from "./MeetingCard";

function MeetingList({ meetings, loading, navigate }) {
  const getStatusBadge = (status) => {
    const badges = {
      uploaded: "bg-gray-200 text-gray-800",
      processing: "bg-yellow-200 text-yellow-800",
      completed: "bg-green-200 text-green-800",
      failed: "bg-red-200 text-red-800",
    };
    return badges[status] || badges.uploaded;
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Loading meetings...</p>
      </div>
    );
  }

  if (meetings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-600">
          No meetings yet. Upload your first recording!
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Meetings</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {meetings.map((meeting) => (
          <MeetingCard
            key={meeting._id}
            meeting={meeting}
            navigate={navigate}
            getStatusBadge={getStatusBadge}
          />
        ))}
      </div>
    </div>
  );
}

export default MeetingList;
