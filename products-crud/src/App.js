import "./App.css";
import axios from "axios";
import useSWR from "swr";

const fetcher = (url) => axios.get(url).then((res) => res.data);

function App() {
  const { data, error, isLoading } = useSWR(
    "https://api.github.com/repos/AdamHCarter/React-CRUD-example",
    fetcher
  );

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  return (
    <div className="container-fluid">
      <div>
        <h1>{data.name}</h1>
      </div>
      <div className="container">
        <h2>Topics</h2>

        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-2">
          {data.topics.length > 0
            ? data.topics.map((dataItem, index) => {
                return <p key={index}>{dataItem}</p>;
              })
            : "No topics set"}
        </div>
      </div>
    </div>
  );
}

export default App;
