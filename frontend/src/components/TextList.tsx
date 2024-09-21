import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Text } from '../interfaces/Text';

const TextList: React.FC = () => {
  const [texts, setTexts] = useState<Text[]>([]);

  useEffect(() => {
    const fetchTexts = async () => {
      try {
        const response = await axios.get<Text[]>('http://localhost:5000/text');
        setTexts(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTexts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/text/${id}`);
      setTexts(texts.filter(text => text._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Text List</h2>
      <ul>
        {texts.map((text) => (
          <li key={text._id}>
            {text.content}
            <button onClick={() => handleDelete(text._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TextList;
