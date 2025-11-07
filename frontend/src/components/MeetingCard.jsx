function MeetingCard({ meeting, navigate, getStatusBadge }) {
  return (
    <div
      onClick={() => navigate(`/report/${meeting._id}`)}
      className="bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/80 
                 rounded-2xl border border-gray-700/40 shadow-lg 
                 hover:shadow-indigo-700/40 hover:border-indigo-500/50 
                 transition-all duration-300 transform hover:-translate-y-2 
                 cursor-pointer flex flex-col justify-between p-5 text-gray-200"
      style={{ minHeight: "270px", maxHeight: "280px" }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg text-white truncate max-w-[70%]">
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
      <p className="text-sm text-gray-300 truncate mb-1">
        🎧{" "}
        <span className="font-medium text-indigo-400">
          {meeting.audioFileName || "No file uploaded"}
        </span>
      </p>

      {/* Date and Time */}
      <p className="text-xs text-gray-500 mb-2">
        {new Date(meeting.createdAt).toLocaleDateString()} •{" "}
        {new Date(meeting.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>

      {/* Summary */}
      {meeting.summary && (
        <p className="text-sm text-gray-300 bg-gray-800/70 border border-gray-700/40 p-2 rounded-lg mt-1 line-clamp-2">
          🧠 <span className="font-semibold text-indigo-400">Summary:</span>{" "}
          {meeting.summary}
        </p>
      )}

      {/* Tasks */}
      {Array.isArray(meeting.tasks) && meeting.tasks.length > 0 && (
        <div className="mt-3 text-xs text-gray-300 flex-1 overflow-hidden">
          <p className="font-semibold mb-1 text-indigo-400">📋 Tasks:</p>
          <ul className="list-disc list-inside space-y-1 overflow-y-auto max-h-[90px] pr-1 custom-scroll">
            {meeting.tasks.slice(0, 3).map((task, i) => (
              <li
                key={i}
                className="leading-snug bg-gray-800/70 border border-gray-700/30 rounded p-1"
              >
                <span className="font-medium text-gray-100">
                  {task.description}
                </span>
                {task.assignedTo && (
                  <span className="text-gray-400"> — {task.assignedTo}</span>
                )}
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
              <li className="text-gray-500 italic">
                +{meeting.tasks.length - 3} more...
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default MeetingCard;
