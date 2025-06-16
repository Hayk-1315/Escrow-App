import express from 'express';
import cors from 'cors';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Configurar base de datos
const file = path.join(__dirname, 'db', 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);


// Inicializa estructura si está vacía
await db.read();
db.data ||= { toBeApproved: [], approvedContracts: [] };
await db.write();

// Ruta para obtener todos los contratos pendientes

app.get('/contracts/pending', (req, res) => {
  const walletAddr = req.query.walletAddr?.toLowerCase();
  const pending = (db.data.toBeApproved || []).filter(
    (contract) =>
      contract.arbiter?.toLowerCase() === walletAddr ||
      contract.depositor?.toLowerCase() === walletAddr
  );
  res.json(pending);
});

// Ruta para agregar un nuevo contrato
app.post('/addContract', async (req, res) => {
  const newContract = req.body;

  if (!newContract || !newContract.address || !newContract.arbiter || !newContract.beneficiary || !newContract.value) {
    return res.status(400).json({ error: 'Missing required contract fields (address, arbiter, beneficiary, value).' });
  }

  await db.read();
  db.data.toBeApproved.push(newContract);
  await db.write();
  res.status(201).json(newContract);
});

// Ruta para mover un contrato a aprobados
app.post('/approve', async (req, res) => {
  const address = req.body.address;

   if (!address) {
    return res.status(400).json({ error: "Address is required." });
  }

  await db.read();

  const index = db.data.toBeApproved.findIndex(c => c.address === address);
  if (index === -1) return res.status(404).json({ error: "Contract not found" });

  const [approved] = db.data.toBeApproved.splice(index, 1);
  db.data.approvedContracts.push(approved);
  await db.write();
  res.json(approved);
});

// Ruta para eliminar un contrato (cancelado)
app.delete('/cancel/:address', async (req, res) => {
  const address = req.params.address;

    if (!address) {
    return res.status(400).json({ error: "Address is required." });
  }

  await db.read();

  const initialLength = db.data.toBeApproved.length;
  db.data.toBeApproved = db.data.toBeApproved.filter(c => c.address !== address);

  if (db.data.toBeApproved.length === initialLength) {
    return res.status(404).json({ error: "Contract not found." });
  }

  await db.write();
  res.status(204).end();
});

// Ruta para obtener contratos aprobados

app.get('/contracts/approved', (req, res) => {
  const walletAddr = req.query.walletAddr?.toLowerCase();
  const approved = (db.data.approvedContracts || []).filter(
    (contract) =>
      contract.arbiter?.toLowerCase() === walletAddr ||
      contract.depositor?.toLowerCase() === walletAddr
  );
  res.json(approved);
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});