export default function Report({ report }) {
    return (
      <div className="report">
        <h2>Due Diligence Report</h2>
        {Object.entries(report).map(([key, value]) => (
          <div key={key} className="report-item">
            <strong>{key}:</strong> {value}
          </div>
        ))}
      </div>
    );
  }