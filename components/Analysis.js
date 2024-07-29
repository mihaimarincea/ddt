export default function Analysis({ analysis }) {
  return (
    <div className="analysis">
      <h2>Claude's Analysis</h2>
      <div dangerouslySetInnerHTML={{ __html: analysis }} />
    </div>
  );
}