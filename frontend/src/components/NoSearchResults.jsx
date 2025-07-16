import "./NoSearchResults.css";
export default function NoSearchResults({ query }) {
    return (
      <div className="no-search-wrapper">
      <div className="no-search-message" style={{ color: "#777" }}>
      <div
      style={{
        textAlign: "center",
        padding: "50px 20px",
        color: "#777",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "60vh",
      }}
    >
      <i
        className="fa-solid fa-magnifying-glass"
        style={{ fontSize: "60px", marginBottom: "20px", color: "#b72a67" }}
      />          <h2>No results found</h2>
          {query && <p className="text-muted">We couldn't find anything for "<strong>{query}</strong>"</p>}
        </div>
      </div>
      </div>
    );
  }
  