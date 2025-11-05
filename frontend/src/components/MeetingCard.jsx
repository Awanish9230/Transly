function MeetingCard({ meeting, navigate, getStatusBadge }) {
  return (
    <div
      className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-5 cursor-pointer border border-gray-200 flex flex-col justify-between"
      style={{ minHeight: "270px", maxHeight: "280px" }}
      onClick={() => navigate(`/report/${meeting._id}`)}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg text-gray-800 truncate max-w-[70%]">
          {meeting.title || "Untitled Meeting"}
        </h3>
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-lg ${getStatusBadge(
            meeting.status
          )}`}
        >
          {meeting.status}
        </span>
      </div>

      {/* File Name */}
      <p className="text-sm text-gray-700 truncate mb-1">
        🎧 <span className="font-medium">{meeting.audioFileName || "No file uploaded"}</span>
      </p>

      {/* Date and Time */}
      <p className="text-xs text-gray-500 mb-2">
        {new Date(meeting.createdAt).toLocaleDateString()} •{" "}
        {new Date(meeting.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </p>

      {/* Summary */}
      {meeting.summary && (
        <p className="text-sm text-gray-700 bg-gray-100 p-2 rounded-lg mt-1 line-clamp-2">
          🧠 <span className="font-semibold">Summary:</span> {meeting.summary}
        </p>
      )}

      {/* Tasks */}
      {Array.isArray(meeting.tasks) && meeting.tasks.length > 0 && (
        <div className="mt-3 text-xs text-gray-700 flex-1 overflow-hidden">
          <p className="font-semibold mb-1">📋 Tasks:</p>
          <ul className="list-disc list-inside space-y-1 overflow-y-auto max-h-[90px] pr-1 custom-scroll">
            {meeting.tasks.slice(0, 3).map((task, i) => (
              <li key={i} className="leading-snug bg-gray-50 rounded p-1">
                <span className="font-medium">{task.description}</span>
                {task.assignedTo && <span className="text-gray-600"> — {task.assignedTo}</span>}
                <br />
                <span className="text-gray-500">
                  {task.deadline && (
                    <>
                      🗓 {new Date(task.deadline).toLocaleDateString()}
                    </>
                  )}
                  {task.priority && <> | ⭐ {task.priority}</>}
                </span>
              </li>
            ))}
            {meeting.tasks.length > 3 && (
              <li className="text-gray-400 italic">+{meeting.tasks.length - 3} more...</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default MeetingCard;
