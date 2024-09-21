import React, { useState } from 'react';
import axios from 'axios';
import './IdeaForm.scss';

const IdeaForm: React.FC = () => {
    const [title, setTitle] = useState<string>('');  // State for title
    const [description, setDescription] = useState<string>('');  // State for description

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Send title and description to the database
            const response = await axios.post('http://localhost:5000/idea/add', {
                title, 
                description
            });
            console.log(response.data);

            // Clear form fields after successful submission
            setTitle('');
            setDescription('');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="idea-form">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a title"
                    required
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter a description"
                    required
                />
                <button type="submit">Add Idea</button>
            </form>
        </div>
    );
};

export default IdeaForm;
