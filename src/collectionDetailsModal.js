import React, { useState } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
    width: '600px',
    borderRadius: '10px',
    zIndex: 1000, // Ensure modal is on top
  },
  overlay: {
    zIndex: 1000, // Ensure overlay is on top
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: Darken the overlay background
  },
};

Modal.setAppElement('#root');

const CollectionDetailsModal = ({ isOpen, onRequestClose, userInfo, pickupInfo, onStartPickup, onCompletePickup }) => {
  const [prices, setPrices] = useState(pickupInfo.items.map(() => ''));

  const handlePriceChange = (index, value) => {
    const newPrices = [...prices];
    newPrices[index] = value;
    setPrices(newPrices);
  };

  const handleCompletePickup = () => {
    const updatedItems = pickupInfo.items.map((item, index) => ({
      ...item,
      price: prices[index],
    }));
    onCompletePickup(updatedItems);
  };

  const allPricesFilled = prices.every(price => price !== '');

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Collection Details Modal"
    >
      <Container>
        <Header>Collection Details</Header>
        <InfoContainer>
          <UserInfo>
            <InfoHeader>User INFO</InfoHeader>
            <InfoBody>
              <InfoItem>Name: {userInfo.name}</InfoItem>
              <InfoItem>Contact: {userInfo.contact}</InfoItem>
              <InfoItem>User ID: {userInfo.userId}</InfoItem>
            </InfoBody>
          </UserInfo>
          <PickupInfo>
            <InfoHeader>Pickup INFO</InfoHeader>
            <InfoBody>
              <InfoItem>Address: {pickupInfo.address}</InfoItem>
              <InfoItem>Schedule Date: {pickupInfo.scheduleDate}</InfoItem>
              <InfoItem>
                Items:
                {pickupInfo.items.map((item, index) => (
                  <div key={index}>
                    {item.category} ({item.weight}) - Price: 
                    <input
                      type="number"
                      value={prices[index]}
                      onChange={(e) => handlePriceChange(index, e.target.value)}
                      required
                    />
                  </div>
                ))}
              </InfoItem>
            </InfoBody>
          </PickupInfo>
        </InfoContainer>
        <Actions>
          {pickupInfo.status === 'in progress' ? (
            <ActionButton onClick={handleCompletePickup} disabled={!allPricesFilled}>
              Complete Pickup
            </ActionButton>
          ) : (
            <ActionButton onClick={onStartPickup}>Start Pickup</ActionButton>
          )}
          <ActionButton>Contact User</ActionButton>
          <ActionButton>Report Issue</ActionButton>
        </Actions>
      </Container>
    </Modal>
  );
};

export default CollectionDetailsModal;

// Styled Components
const Container = styled.div`
  text-align: center;
`;

const Header = styled.h1`
  font-size: 24px;
  color: #2e7d32;
  margin-bottom: 20px;
`;

const InfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const UserInfo = styled.div`
  width: 45%;
  background-color: #e0e0e0;
  padding: 10px;
  border-radius: 10px;
`;

const PickupInfo = styled.div`
  width: 45%;
  background-color: #e0e0e0;
  padding: 10px;
  border-radius: 10px;
`;

const InfoHeader = styled.h2`
  font-size: 18px;
  color: #2e7d32;
  margin-bottom: 10px;
`;

const InfoBody = styled.div`
  text-align: left;
`;

const InfoItem = styled.p`
  margin: 5px 0;
`;

const Actions = styled.div`
  margin-top: 20px;
`;

const ActionButton = styled.button`
  padding: 10px 20px;
  margin: 0 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background: #0056b3;
  }
`;
