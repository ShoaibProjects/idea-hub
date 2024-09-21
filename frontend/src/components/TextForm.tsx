import React, { useState } from 'react';
import axios from 'axios';

const TextForm: React.FC = () => {
  const [content, setContent] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/text/add', { content });
      console.log(response.data);
      setContent('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter some text"
        required
      />
      <button type="submit">Add Text</button>
    </form>
  );
};

export default TextForm;
