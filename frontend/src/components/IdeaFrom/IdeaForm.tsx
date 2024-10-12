import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPostedContent, selectUser } from '../../components/Auth/userSlice';
import { selectCategories } from '../../Redux-slices/categories/categorySlices';
import axios from 'axios';
import './IdeaForm.scss';


const IdeaForm: React.FC = () => {
    const [title, setTitle] = useState<string>('');  // State for title
    const [description, setDescription] = useState<string>('');  // State for description
    const user = useSelector(selectUser);
    const [category, setCategory] = useState(''); // Can be empty
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

    const categories = useSelector(selectCategories);
    
    const filteredSuggestions = categories.filter((category) =>
        category.toLowerCase().startsWith(tagInput.toLowerCase())
      );
      const dispatch = useDispatch();
    // You can add more categories here

    // Handle tag input when the user presses ',' or 'Enter'
    const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === ',' || e.key === 'Enter') {
            e.preventDefault();
            if (tagInput.trim() !== '') {
                if (tags.length >= 5) {
                    alert("You can only add up to 5 tags.");
                    return;
                  }
                  // Check for duplicate tags
                  if (tags.includes(tagInput.trim())) {
                    alert("This tag is already added.");
                    return;
                  }
                setTags([...tags, tagInput.trim()]); // Add tag to the array
                setTagInput('');  // Clear the input field after adding tag
            }
        }
    };

    const handleTagDelete = (tagToDelete: string) => {
        setTags(tags.filter(tag => tag !== tagToDelete));  // Remove tag from list
    };

    const handleSuggestionClick = (suggestion: string) => {
        if (!tags.includes(suggestion) && tags.length <= 5) {
          setTags([...tags, suggestion]);
        } else if(tags.includes(suggestion) && tags.length <= 5) {
            alert("This tag is already added.");
        } else if(tags.length > 5){
            alert("You can only add up to 5 tags.");
          }

        setTagInput(''); // Clear input
        setShowSuggestions(false); // Hide dropdown
      };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Send title and description to the database
            const response = await axios.post('http://localhost:5000/idea/add', {
                title,
                description,
                creator: user.username,
                category: category || null, // Allow category to be empty
                tags,
            }, { withCredentials: true });
            console.log(response.data);
            const ideaId = response.data._id; // Assuming the response contains the new idea's ID
            console.log("Idea added:", ideaId);

            // Now update the user's postedContent array with this new idea ID
            await axios.put(`http://localhost:5000/user/${user.username}/add-posted-idea`, {
                ideaId,
            }, { withCredentials: true });
            
            // Clear form fields after successful submission
            if (response.status === 201) {
                alert('Idea submitted successfully!');
                dispatch(addPostedContent(ideaId));
            } else {
                alert('Error submitting idea');
            }
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
                <div>
                    <label>Category</label>
                    <div className="select-container">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="category-dropdown"
                        >
                            <option value="">None</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="tag-input-container">
                    <label>Tags:</label>
                    <div className="tag-input">
                        {tags.map((tag, index) => (
                            <div key={index} className="tag">
                                {tag}
                                <span className="tag-close" onClick={() => handleTagDelete(tag)}>
                                    &times;
                                </span>
                            </div>
                        ))}
                        <input
              type="text"
              value={tagInput}
              onChange={(e) => {
                setTagInput(e.target.value);
                setShowSuggestions(true); // Show suggestions on input
              }}
              onKeyDown={handleTagInputKeyDown}
              placeholder="Add a tag and press ',' or 'Enter'"
            />

            {/* Show dropdown of tag suggestions */}
            {showSuggestions && tagInput && (
              <ul className="suggestion-dropdown">
                {filteredSuggestions.length > 0 ? (
                  filteredSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </li>
                  ))
                ) : (
                  <li>No suggestions found</li>
                )}
              </ul>
            )}
          </div>
                </div>
                <button type="submit">Add Idea</button>
            </form>
        </div>
    );
};

export default IdeaForm;
