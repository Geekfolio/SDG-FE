import React from "react";

interface LeetCodeProgressCircleProps {
  easy: number;
  medium: number;
  hard: number;
}

const LeetCodeProgressCircle: React.FC<LeetCodeProgressCircleProps> = ({
  easy,
  medium,
  hard,
}) => {
  const total = 3451;
  const radius = 40;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;

  // Calculate the arc lengths for each segment (using the total circumference)
  const easyArc = (easy / total) * circumference;
  const mediumArc = (medium / total) * circumference;
  const hardArc = (hard / total) * circumference;

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <svg width="100" height="100" viewBox="0 0 100 100">
        <defs>
          <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="2"
              floodColor="rgba(0,0,0,0.3)"
            />
          </filter>
        </defs>
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="lightgray"
          strokeWidth={strokeWidth}
          filter="url(#dropShadow)"
          strokeLinecap="round"
        />
        {/* Easy segment */}
        {easy > 0 && (
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="green"
            strokeWidth={strokeWidth}
            strokeDasharray={`${easyArc} ${circumference - easyArc}`}
            strokeDashoffset="0"
            transform="rotate(-90 50 50)"
            filter="url(#dropShadow)"
            strokeLinecap="round"
          />
        )}
        {/* Medium segment */}
        {medium > 0 && (
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="orange"
            strokeWidth={strokeWidth}
            strokeDasharray={`${mediumArc} ${circumference - mediumArc}`}
            strokeDashoffset={-easyArc}
            transform="rotate(-90 50 50)"
            filter="url(#dropShadow)"
            strokeLinecap="round"
          />
        )}
        {/* Hard segment */}
        {hard > 0 && (
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="red"
            strokeWidth={strokeWidth}
            strokeDasharray={`${hardArc} ${circumference - hardArc}`}
            strokeDashoffset={-(easyArc + mediumArc)}
            transform="rotate(-90 50 50)"
            filter="url(#dropShadow)"
            strokeLinecap="round"
          />
        )}
      </svg>
      <div style={{ marginLeft: "1rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "0.5rem",
          }}
        >
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "green",
              marginRight: "0.5rem",
            }}
          ></span>
          <span>{easy} Easy</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "0.5rem",
          }}
        >
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "orange",
              marginRight: "0.5rem",
            }}
          ></span>
          <span>{medium} Medium</span>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "red",
              marginRight: "0.5rem",
            }}
          ></span>
          <span>{hard} Hard</span>
        </div>
      </div>
    </div>
  );
};

export default LeetCodeProgressCircle;
