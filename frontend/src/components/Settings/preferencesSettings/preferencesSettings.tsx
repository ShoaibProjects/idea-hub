import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { selectUser, updatePref } from '../../Auth/userSlice';
import { selectCategories } from '../../../Redux-slices/categories/categorySlices';

const PrefSettings: React.FC = () => {
    const user = useSelector(selectUser);
    const [selectedPreferences, setSelectedPreferences] = useState<string[]>(user.preferences);
    const categories = useSelector(selectCategories);
    const dispatch = useDispatch();

    const handlePreferenceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (!selectedPreferences.includes(value) && selectedPreferences.length < 5) {
          setSelectedPreferences([...selectedPreferences, value]);
        } else if (selectedPreferences.includes(value)) {
          alert("Preference already selected");
        } else {
          alert("You can only select up to 5 preferences.");
        }
      };
    
      const handlePreferenceRemove = (preference: string) => {
        setSelectedPreferences(selectedPreferences.filter((pref) => pref !== preference));
      };

      const changePreferences = async () => {
        try {
            const response = await axios.patch(
              `http://localhost:5000/user/update/preferences`, 
              { 
                username: user.username,
                preferences: selectedPreferences
              },
              { withCredentials: true }
            );
      
            if (response.status === 200) {
                dispatch(updatePref(selectedPreferences))
              alert('Preferences updated successfully!');
            } else {
              alert('Failed to update preferences');
            }
          } catch (error) {
            console.error('Error updating preferences:', error);
            alert('Failed to update preferences');
          }
      }

    return (
        <>
        <div>
        <div className="preferences-dropdown">
        <label>Select Preferences :</label>
        <select onChange={handlePreferenceChange}>
          <option value="">Select a preference</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <div className="selected-preferences">
          {selectedPreferences.map((preference, index) => (
            <div key={index} className="preference-bubble">
              {preference}
              <span onClick={() => handlePreferenceRemove(preference)}>&times;</span>
            </div>
          ))}
        </div>
      </div>
      <button onClick={changePreferences}>Save</button>
        </div>
        </>
    )
}

export default PrefSettings;
