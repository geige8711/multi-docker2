import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const Fib = () => {
  const [seenIndexes, setSeenIndexes] = useState([]);
  const [values, setValues] = useState({});
  const [index, setIndex] = useState("");

  const fetchValues = async () => {
    try {
      const myValues = await axios.get("/api/values/current");
      setValues(myValues.data);
    } catch (err) {
      console.log(err);
    }
  };
  const fetchIndexes = async () => {
    try {
      const mySeenIndexes = await axios.get("/api/values/all");
      setSeenIndexes(mySeenIndexes.data);
    } catch (err) {
      console.log(err);
    }
  };

  const renderSeenIndexes = useCallback(() => {
    return seenIndexes.map(({ number }) => number).join(", ");
  }, [seenIndexes]);

  const renderValues = useCallback(() => {
    const entries = [];

    for (let key in values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {values[key]}
        </div>
      );
    }

    return entries;
  }, [values]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/values", {
        index,
      });
      setIndex("");
      fetchIndexes();
      fetchValues();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchIndexes();
    fetchValues();
  }, []);
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label></label>
        <input
          type="text"
          value={index}
          onChange={(e) => {
            setIndex(e.target.value);
          }}
        />
        <button type="submit">Submit</button>
      </form>

      <h3>Indexes I have seen: </h3>
      {renderSeenIndexes()}
      <h3>Calculated Values: </h3>
      {renderValues()}
    </div>
  );
};

export default Fib;
