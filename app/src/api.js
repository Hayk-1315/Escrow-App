const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

//
export async function getPendingContracts(walletAddr) {
  const response = await fetch(`${API_URL}/contracts/pending?walletAddr=${walletAddr}`);
  return await response.json();
}

export async function getApprovedContracts(walletAddr) {
  const response = await fetch(`${API_URL}/contracts/approved?walletAddr=${walletAddr}`);
  return await response.json();
}

export const addNewContract = async (contract) => {
  const res = await fetch(`${API_URL}/addContract`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contract)
  });
  return res.json();
};

export const markAsApproved = async (address) => {
  const res = await fetch(`${API_URL}/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address })
  });
  return res.json();
};

export const cancelContract = async (address) => {
  const res = await fetch(`${API_URL}/cancel/${address}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('Failed to cancel contract in backend');
  }

  // No intentamos hacer res.json() si el status es 204 (sin contenido)
  return true;
};