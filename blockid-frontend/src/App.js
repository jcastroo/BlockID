import React, { useState, useEffect } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from 'ethers';
import { Button, TextField, Typography, Container, Box, Grid, CircularProgress } from '@mui/material';

const contractAddress = "0xD1Cf14341c15eD5ACd821fA0FeDdaeb58375c0c3";

const contractABI = [
  "function registerIdentity(string _name, string _email, uint256 _birthDate) public",
  "function updateIdentity(string _name, string _email, uint256 _birthDate) public",
  "function getIdentity(address _user) public view returns (string, string, uint256)"
];

const App = () => {
  const [identity, setIdentity] = useState({ name: "", email: "", birthDate: 0 });
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);

  // Conectar carteira com Metamask
  const connectWallet = async () => {
    if (window.ethereum) {
      const newProvider = new Web3Provider(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const signer = newProvider.getSigner();
      const blockIDContract = new Contract(contractAddress, contractABI, signer);
      setProvider(newProvider);
      setContract(blockIDContract);
      setAccount(await signer.getAddress());
    } else {
      alert("Please install Metamask!");
    }
  };

  const registerIdentity = async () => {
    if (contract) {
      setLoading(true);
      try {
        const tx = await contract.registerIdentity(identity.name, identity.email, identity.birthDate);
        console.log("Transação enviada. Aguardando confirmação...");
        await tx.wait();  // Aguardar pela confirmação
        alert("Identidade registrada com sucesso!");
      } catch (error) {
        console.error("Erro ao registrar identidade:", error);
        alert("Erro ao registrar identidade");
      }
      setLoading(false);
    }
  };

  // Obter identidade
  const getIdentity = async () => {
    if (contract && account) {
      setLoading(true);
      const identityData = await contract.getIdentity(account);
      setIdentity({ name: identityData[0], email: identityData[1], birthDate: identityData[2] });
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ paddingTop: '2rem' }}>
      <Typography variant="h4" gutterBottom align="center">
        BlockID
      </Typography>
      {!account ? (
        <Button variant="contained" fullWidth onClick={connectWallet}>Conectar Metamask</Button>
      ) : (
        <Box>
          <Typography variant="h6">Conta: {account}</Typography>
          <Typography variant="h5" gutterBottom>Identidade</Typography>
          
          <TextField
            label="Nome"
            variant="outlined"
            fullWidth
            value={identity.name}
            onChange={(e) => setIdentity({ ...identity, name: e.target.value })}
            sx={{ marginBottom: '1rem' }}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={identity.email}
            onChange={(e) => setIdentity({ ...identity, email: e.target.value })}
            sx={{ marginBottom: '1rem' }}
          />
          <TextField
            label="Data de Nascimento"
            variant="outlined"
            fullWidth
            type="number"
            value={identity.birthDate}
            onChange={(e) => setIdentity({ ...identity, birthDate: e.target.value })}
            sx={{ marginBottom: '1rem' }}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              onClick={registerIdentity}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Registrar Identidade'}
            </Button>
            <Button 
              variant="outlined" 
              color="secondary" 
              fullWidth 
              onClick={getIdentity}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Obter Identidade'}
            </Button>
          </Box>

          {identity.name && <Typography variant="body1">Nome: {identity.name}</Typography>}
          {identity.email && <Typography variant="body1">Email: {identity.email}</Typography>}
          {identity.birthDate && <Typography variant="body1">Data de Nascimento: {identity.birthDate}</Typography>}
        </Box>
      )}
    </Container>
  );
};

export default App;
