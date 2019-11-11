import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

import 'antd/dist/antd.css';
import './App.css';

import {
  Layout,
  Tree,
  Statistic,
  Select,
  Form,
  Input,
  Button,
  message
} from 'antd';
const { Header, Footer, Sider, Content } = Layout;
const { TreeNode } = Tree;
const { Option } = Select;

const web3 = new Web3('ws://localhost:7545');

function App() {
  const [node, setNode] = useState('Unknown Node');
  const [accounts, setAccounts] = useState([]);
  const [balance, setBalance] = useState(0);
  const [account, setAccount] = useState(null);
  const [targetAccount, setTargetAccount] = useState(null);
  const [transferAmount, setTransferAmount] = useState(0);

  web3.eth.getNodeInfo(function(error, result) {
    if (error) {
      console.error(error);
    } else {
      setNode(result);
    }
  });

  useEffect(() => {
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.error(error);
      } else {
        setAccounts(accounts);
      }
    });

    if (window.require) {
      const electron = window.require('electron');
      const ipcRenderer = electron.ipcRenderer;

      const showNodeInfo = (_, command) => {
        if (command === 'show-node-info') {
          window.alert(`Node: ${node}`);
        }
      }
  
      ipcRenderer.on('commands', showNodeInfo);
      
      return () => {
        ipcRenderer.off('commands', showNodeInfo);
      }
    }

  }, [node]);

  const formatAccountName = name => {
    if (name && name.length > 10) {
      return `${name.substring(0, 10)}...`;
    }
    return 'Noname';
  };

  const onSelectAccount = keys => {
    const [account] = keys;

    if (account && account !== 'accounts') {
      web3.eth.getBalance(account).then(function(result) {
        setBalance(web3.utils.fromWei(result, 'ether'));
        setAccount(account);
      });
    } else {
      setBalance(0);
      setAccount(null);
    }
  };

  const onTransferClick = () => {
    const transaction = {
      from: account,
      to: targetAccount,
      value: web3.utils.toWei(transferAmount, 'ether')
    };

    web3.eth.sendTransaction(transaction, function(error, hash) {
      if (error) {
        console.error('Transaction error', error);
      } else {
        message.info(
          `Successfully transferred ${transferAmount}. Hash: ${hash}`
        );
        onSelectAccount([account]);
        setTransferAmount(0);
      }
    });
  };

  const canTransfer = () => {
    return account && targetAccount && transferAmount && transferAmount > 0;
  };

  return (
    <div className="App">
      <Layout>
        <Header>{node}</Header>
        <Layout>
          <Sider>
            <Tree onSelect={onSelectAccount}>
              <TreeNode title="Accounts" key="accounts">
                {accounts.map(account => (
                  <TreeNode
                    key={account}
                    title={formatAccountName(account)}
                  ></TreeNode>
                ))}
              </TreeNode>
            </Tree>
          </Sider>
          <Content>
            <Statistic
              title="Account Balance (Eth)"
              value={balance}
              precision={2}
            />
            <Form style={{ width: 450 }}>
              <Form.Item>
                <Input value={account} disabled={true}></Input>
              </Form.Item>
              <Form.Item>
                <Select
                  placeholder="Select target account"
                  onChange={value => setTargetAccount(value)}
                >
                  {accounts
                    .filter(acc => acc !== account)
                    .map(account => (
                      <Option key={account} value={account}>
                        {account}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item>
                <Input
                  type="number"
                  min="0"
                  placeholder="Amount"
                  value={transferAmount}
                  onChange={e => setTransferAmount(e.target.value)}
                ></Input>
              </Form.Item>
              <Button disabled={!canTransfer()} onClick={onTransferClick}>
                Transfer
              </Button>
            </Form>
          </Content>
        </Layout>
        <Footer>Footer</Footer>
      </Layout>
    </div>
  );
}

export default App;
