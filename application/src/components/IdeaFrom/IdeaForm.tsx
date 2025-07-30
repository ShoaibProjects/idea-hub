import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPostedContent, selectUser } from '../../hooks/auth/userSlice';
import { selectCategories } from '../../Redux-slices/categories/categorySlices';
import axios from 'axios';
import Select from 'react-select';
import './IdeaForm.scss';
import { useNavigate } from 'react-router';
import { handleLogout } from '../Buttons/LogOutBtn/LogOutUser';

const IdeaForm: React.FC = () => {
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const user = useSelector(selectUser);
    const [category, setCategory] = useState<string>('');  // Store category as a string
    const [tags, setTags] = useState<string[]>([]);  // Store tags as an array of strings
    // const [tagInput, setTagInput] = useState<string>('');
    // const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

    const titleRef = useRef(null);
    const descRef = useRef(null);
    // const submitButtonRef = useRef(null);
    // const tagRef = useRef(null);
    const catRef = useRef(null);

    const categories = useSelector(selectCategories);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleCategoryChange = (selectedCategory: any) => {
        setCategory(selectedCategory?.value || '');  // Extract string from selected value
    };

    const handleTagChange = (selectedTags: any) => {
        if (selectedTags.length <= 5) {
            setTags(selectedTags.map((tag: any) => tag.value));  // Extract values from selected tags
        } else {
            alert('You can only select up to 5 tags.');
        }
    };

    const validateForm = () => {
        if (!title.trim() || !description.trim() || !category) {
            alert('All fields are required.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await axios.post('https://idea-hub-app.vercel.app/idea/add', {
                title, 
                description, 
                creator: user.username, 
                category,  // Send category as a string
                tags,  // Send tags as an array of strings
            }, { withCredentials: true });

            const ideaId = response.data._id;
            await axios.put(`https://idea-hub-app.vercel.app/user/${user.username}/add-posted-idea`, { ideaId }, { withCredentials: true });

            if (response.status === 201) {
                alert('Idea submitted successfully!');
                dispatch(addPostedContent(ideaId));
                navigate('/userinfo');
            } else {
                alert(response.data.message);
            }
        }  catch (error: unknown) {
            console.error('Error submitting idea:', error);
          
            // Check if the error is an AxiosError
            if (axios.isAxiosError(error) && error.response) {
              const status = error.response.status;
          
              switch (status) {
                case 400:
                    alert(error.response.data.message);
                    break;
                case 401:
                  console.error('Unauthorized. Redirecting to login.');
                  navigate('/signin');
                  break;
          
                case 440:
                  console.log('Session expired. Redirecting to login.');
                  alert("Session expired. Please log in again.");
                  await handleLogout(dispatch, navigate);
                  break;
          
                case 403:
                  console.error('Access forbidden. Invalid token.');
                  alert("Invalid token. Please log in again.");
                  await handleLogout(dispatch, navigate);
                  break;
          
                case 500:
                  console.error('Server error. Please try again later.');
                  alert("A server error occurred. Please try again later.");
                  break;
          
                default:
                  console.error(`Unhandled error with status ${status}`);
              }
            } else {
              console.error('Network error or request failed without response');
              alert("Network error. Please check your connection.");
            }
      
          }
    };

    const handleKeyDown = (
        event: React.KeyboardEvent,
        nextRef: React.RefObject<HTMLInputElement>
      ) => {
        if (event.key === 'Enter' && nextRef.current) {
          nextRef.current.focus();
        }
      };

    return (
        <div className="idea-form-cont">
            <form className="idea-form" onSubmit={handleSubmit}>
                <h2>Submit Your Idea</h2>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter title"
                    required
                    onKeyDown={(e) => handleKeyDown(e, descRef)}
                    ref={titleRef}
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter description"
                    required
                    onKeyDown={(e) => handleKeyDown(e, catRef)}
                    ref={descRef}
                />
                
                <div className="category-select">
                    <label>Category</label>
                    <Select
                        options={categories.map(cat => ({ value: cat, label: cat }))}  // Categories still as options with value as string
                        onChange={handleCategoryChange}
                        value={category ? { value: category, label: category } : null}  // Display as selected category
                        placeholder="Select a category"
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                border: '1px solid #e2e8f0',
                                borderRadius: '0.75rem',
                                boxShadow: 'none',
                                '&:hover': { borderColor: '#3b82f6' },
                            }),
                            menu: (provided) => ({
                                ...provided,
                                zIndex: 9999,
                            }),
                            menuList: (provided) => ({
                              ...provided,
                              background: 'var(--background-color-sec)',
                              maxHeight: '150px', // Set max height for the dropdown
                              overflowY: 'auto', // Enable vertical scrolling
                            }),
                            option: (provided, state) => ({
                                ...provided,
                                color: state.isFocused
                                  ? '#333' 
                                  : 'var(--text-color)',
                              }),
                        }}
                        isClearable
                    />
                </div>


                <div className="tag-input-container">
                    <label>Tags:</label>
                    <Select
                        options={categories.map(cat => ({ value: cat, label: cat }))}  // Use categories as options for tags too
                        isMulti
                        onChange={handleTagChange}
                        value={tags.map(tag => ({ value: tag, label: tag }))}  // Convert tags to the format expected by react-select
                        placeholder="Add tags..."
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                border: '1px solid #e2e8f0',
                                borderRadius: '0.75rem',
                                boxShadow: 'none',
                                '&:hover': { borderColor: '#3b82f6' },
                            }),
                            menu: (provided) => ({
                                ...provided,
                                zIndex: 9999,
                            }),
                            menuList: (provided) => ({
                              ...provided,
                              background: 'var(--background-color-sec)',
                              maxHeight: '100px', // Set max height for the dropdown
                              overflowY: 'auto', // Enable vertical scrolling
                            }),
                            multiValue: (provided) => ({
                                ...provided,
                                backgroundColor: 'whitesmoke',
                            }),
                            multiValueLabel: (provided) => ({
                                ...provided,
                                color: '#2563eb',
                            }),
                            multiValueRemove: (provided) => ({
                                ...provided,
                                color: '#f87171',
                                cursor: 'pointer',
                                '&:hover': { color: '#ef4444' },
                            }),
                            option: (provided, state) => ({
                                ...provided,
                                color: state.isFocused
                                  ? '#333' 
                                  : 'var(--text-color)',
                              }),
                        }}
                    />
                </div>

                <div className="submit-button">
                    <button type="submit">Submit Idea</button>
                </div>
            </form>
        </div>
    );
};

export default IdeaForm;
