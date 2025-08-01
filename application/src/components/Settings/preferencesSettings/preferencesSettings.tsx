import React from 'react';
import Select from 'react-select';
import { usePreferences } from '../../../hooks/usePreferences';
import "../Settings.scss";

const CustomMultiValue = () => null;

const PrefSettings: React.FC = () => {
  const {
    selectedPreferences,
    setSelectedPreferences,
    categoryOptions,
    handlePreferenceChange,
    savePreferences,
    isLoading,
  } = usePreferences();

  const handleRemovePreference = (preferenceToRemove: string) => {
    setSelectedPreferences(
      selectedPreferences.filter((pref) => pref !== preferenceToRemove)
    );
  };

  return (
    <div className='pref-cont'>
      <div className="preferences-dropdown">
        <label>Select Preferences (Max 5):</label>
        <Select
          isMulti
          options={categoryOptions}
          value={categoryOptions.filter(option => selectedPreferences.includes(option.value))}
          onChange={handlePreferenceChange}
          components={{ MultiValue: CustomMultiValue }}
          placeholder="Select preferences"
          className="react-select-container"
          classNamePrefix="react-select"
          isClearable={false}
          styles={{
            control: (provided) => ({
              ...provided,
              border: '1px solid #e2e8f0',
              borderRadius: '0.75rem',
              marginTop: '.5rem',
              maxWidth: '20rem',
            }),
            menu: (provided) => ({ ...provided, zIndex: 9999 }),
            menuList: (provided) => ({
              ...provided,
              background: 'var(--background-color-sec)',
              maxHeight: '250px',
              overflowY: 'auto',
            }),
            option: (provided, state) => ({
              ...provided,
              color: state.isFocused ? '#333' : 'var(--text-color)',
            }),
          }}
        />
        <div className="selected-preferences">
          {selectedPreferences.map((preference, index) => (
            <div key={index} className="preference-bubble">
              {preference}
              <span onClick={() => handleRemovePreference(preference)}>
                &times;
              </span>
            </div>
          ))}
        </div>
      </div>
      <button className='pref-save-btn' onClick={savePreferences} disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
};

export default PrefSettings;
