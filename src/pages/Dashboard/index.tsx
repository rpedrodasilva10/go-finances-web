import React, { useEffect, useState } from 'react';
import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';
import Header from '../../components/Header';
import api from '../../services/api';
import { Card, CardContainer, Container, TableContainer } from './styles';

interface TransactionWrapper {
  transactions: Transaction[];
  balance: Balance;
}
interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const response = await api.get<TransactionWrapper>('/transactions');

      // Trata formatação da data de valor
      response.data.transactions.map((transaction) => {
        transaction.formattedValue = Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
          transaction.value
        );
        transaction.formattedDate = new Date(transaction.created_at).toLocaleDateString();
      });

      console.log('Transactions: ', response.data.transactions);
      console.log('Balance: ', response.data.balance);

      setTransactions(response.data.transactions);
      setBalance(response.data.balance);
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">
              {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance.income)}
            </h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">
              {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance.outcome)}
            </h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">
              {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance.total)}
            </h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((transaction) => {
                return (
                  <tr key={transaction.id}>
                    <td className="title">{transaction.title}</td>
                    <td className={transaction.type}>
                      {(transaction.type == 'outcome' ? '- ' : '') + transaction.formattedValue}
                    </td>
                    <td>{transaction?.category?.title}</td>
                    <td>{transaction.formattedDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
