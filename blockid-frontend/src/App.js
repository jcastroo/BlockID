import React, { useState, useEffect } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from 'ethers';
import { Button, TextField, Typography, Container, Box, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { styled } from '@mui/system';

const contractAddress = "0xD1Cf14341c15eD5ACd821fA0FeDdaeb58375c0c3";
const contractABI = [
  "function registerIdentity(string _name, string _email, uint256 _birthDate) public",
  "function updateIdentity(string _name, string _email, uint256 _birthDate) public",
  "function getIdentity(address _user) public view returns (string, string, uint256)"
];

const ContainerStyled = styled(Container)(({ theme }) => ({
  padding: '3rem 1.5rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: '#f0f4f8',
  minHeight: '100vh',
  [theme.breakpoints.up('sm')]: {
    padding: '4rem 3rem',
  },
}));

const CardStyled = styled(Paper)(({ theme }) => ({
  padding: '2.5rem',
  width: '100%',
  maxWidth: '700px',
  borderRadius: '16px',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#ffffff',
  marginBottom: '2rem',
  textAlign: 'center',
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
  padding: '1rem',
  marginTop: '1.5rem',
  borderRadius: '8px',
  backgroundColor: '#007bff',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#0056b3',
  },
}));

const SubmitButtonStyled = styled(Button)(({ theme }) => ({
  backgroundColor: '#28a745',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#218838',
  },
  padding: '1rem',
  borderRadius: '8px',
}));

const SecondaryButtonStyled = styled(Button)(({ theme }) => ({
  borderColor: '#007bff',
  color: '#007bff',
  '&:hover': {
    backgroundColor: '#e9f1f8',
  },
  padding: '1rem',
  borderRadius: '8px',
}));

const ProgressStyled = styled(CircularProgress)(({ theme }) => ({
  marginLeft: '10px',
  color: '#007bff',
}));

const App = () => {
  const [identity, setIdentity] = useState({ name: "", email: "", birthDate: 0 });
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    birthDate: ''
  });

  useEffect(() => {
    if (account && contract) {
      checkIfRegistered();
    }
  }, [account, contract]);

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

  const checkIfRegistered = async () => {
    try {
      const existingIdentity = await contract.getIdentity(account);
      if (existingIdentity[0] !== "") {
        setIdentity({
          name: existingIdentity[0],
          email: existingIdentity[1],
          birthDate: existingIdentity[2]
        });
        setIsRegistered(true);
      } else {
        setIsRegistered(false);
      }
    } catch (error) {
      console.error("Erro ao verificar identidade:", error);
      setError("Erro ao verificar identidade.");
    }
  };

  const validateForm = () => {
    let errors = { name: '', email: '', birthDate: '' };
    let isValid = true;

    if (!identity.name) {
      errors.name = "Nome é obrigatório.";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!identity.email || !emailRegex.test(identity.email)) {
      errors.email = "E-mail inválido.";
      isValid = false;
    }

    if (identity.birthDate < 1) {
      errors.birthDate = "Data de nascimento inválida.";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const registerIdentity = async () => {
    if (contract && validateForm()) {
      setLoading(true);
      setError("");
      try {
        const tx = await contract.registerIdentity(identity.name, identity.email, identity.birthDate);
        console.log("Transação enviada. Aguardando confirmação...");
        await tx.wait();
        alert("Identidade registrada com sucesso!");
        setIsRegistered(true);
      } catch (error) {
        console.error("Erro ao registrar identidade:", error);
        setError("Erro ao registrar identidade.");
      }
      setLoading(false);
    }
  };

  const getIdentity = async () => {
    if (contract && account) {
      setLoading(true);
      setError("");
      try {
        const identityData = await contract.getIdentity(account);
        setIdentity({ name: identityData[0], email: identityData[1], birthDate: identityData[2] });
      } catch (error) {
        console.error("Erro ao obter identidade:", error);
        setError("Erro ao obter identidade.");
      }
      setLoading(false);
    }
  };

  return (
    <ContainerStyled maxWidth="sm">
      <CardStyled>
        <Typography variant="h4" color="primary" gutterBottom>
          BlockID
        </Typography>
        
        {!account ? (
          <ButtonStyled 
            variant="contained" 
            fullWidth 
            onClick={connectWallet}
          >
            Conectar Metamask
          </ButtonStyled>
        ) : (
          <Box>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Conta: {account}
            </Typography>
            
            <Typography variant="h5" gutterBottom>
              Identidade
            </Typography>

            <TextField
              label="Nome"
              variant="outlined"
              fullWidth
              value={identity.name}
              onChange={(e) => setIdentity({ ...identity, name: e.target.value })}
              margin="normal"
              disabled={isRegistered}
              error={!!formErrors.name}
              helperText={formErrors.name}
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={identity.email}
              onChange={(e) => setIdentity({ ...identity, email: e.target.value })}
              margin="normal"
              disabled={isRegistered}
              error={!!formErrors.email}
              helperText={formErrors.email}
            />
            <TextField
              label="Data de Nascimento"
              variant="outlined"
              fullWidth
              type="number"
              value={identity.birthDate}
              onChange={(e) => setIdentity({ ...identity, birthDate: e.target.value })}
              margin="normal"
              disabled={isRegistered}
              error={!!formErrors.birthDate}
              helperText={formErrors.birthDate}
            />

            {error && (
              <Box mt={2}>
                <Typography color="error" variant="body1">{error}</Typography>
              </Box>
            )}

            {!isRegistered && (
              <SubmitButtonStyled 
                variant="contained" 
                fullWidth 
                onClick={registerIdentity}
                disabled={loading}
              >
                {loading ? <ProgressStyled size={24} /> : 'Registrar Identidade'}
              </SubmitButtonStyled>
            )}

            <SecondaryButtonStyled 
              variant="outlined" 
              fullWidth 
              onClick={getIdentity}
              disabled={loading || isRegistered}
            >
              {loading ? <ProgressStyled size={24} /> : 'Obter Identidade'}
            </SecondaryButtonStyled>

            {identity.name && (
              <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Dados</strong></TableCell>
                      <TableCell><strong>Valores</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Nome</TableCell>
                      <TableCell>{identity.name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Email</TableCell>
                      <TableCell>{identity.email}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Data de Nascimento</TableCell>
                      <TableCell>{identity.birthDate}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}
      </CardStyled>
    </ContainerStyled>
  );
};

export default App;
