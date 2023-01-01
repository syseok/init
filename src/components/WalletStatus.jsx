import { useWeb3React } from "@web3-react/core"
import { ethers } from "ethers";
import { useEffect } from "react";
import { useState } from "react";
import styled from 'styled-components';

const ChainId = () => {
    const { chainId } = useWeb3React();

    return (
        <div> Chain Id: {chainId}</div>
    )

}

const BlockNumber = () => {
    const { chainId, library } = useWeb3React();
    const[blockNumber, setBlockNumber] = useState();

    let stale = false;

    useEffect(() => {
        if(!library) {
            return
        }

        async function getBlockNumber(library) {
            try{
                const blockNumber = await library.getBlockNumber();

                if(!stale) {
                    setBlockNumber(blockNumber);
                }
            } catch (error) {
                console.error('error',error)

                if(!stale) {
                    setBlockNumber(undefined);
                }
            }
        }

        getBlockNumber(library)

        library.on('block',setBlockNumber)

        return () => {
            stale = true;
            library.removeListener('block',setBlockNumber);
            setBlockNumber(undefined);
        }
    },[library,chainId])

    return (
        <div>BlockNumber: {blockNumber}</div>
    )
}

const Account = () => {
    const {account} = useWeb3React();

    return(
        <div>
            Account : {typeof account === 'undefined' ? '' : `${account.substring(0,6)}...${account.substring(account.length-4)}`}
        </div>
    )

}

const Balance = () => {
    const {account,library,chainId} = useWeb3React();
    const [balance,setBalance] = useState();


    useEffect(() => {
        let stale = false;

        if(typeof account === 'undefined'||account===null||!library) {
            return
        }

        async function getBalance(library, account) {
            const balance = await library.getBalance(account);
            if (!stale) {
                setBalance(balance);
            }
        }
    
        getBalance(library,account)
    
        const getBalanceHandler = () => {
            getBalance(library,account)
        }
    
        library.on('block',getBalanceHandler);

        return () => {
            stale = true;
            library.removeListener('block',getBalanceHandler)
            setBalance(undefined)
        }

    },[account,library,chainId])



    return (
        <div>
            Balance : {balance ? `${ethers.utils.formatEther(balance)} ETH` : ''}
        </div>
    )

}

const NextNonce= () => {
    const { account, library, chainId } =useWeb3React()
    const [nextNonce, setNextNonce] = useState()

    

    useEffect(() => {
        if(typeof account === 'undefined'||account===null||!library) {
            return
        }

        let stale = false;

        async function getNextNonce(
            library,account
        ) {
            const nextNonce = await library.getTransactionCount(account);
            
            if(!stale) {
                setNextNonce(nextNonce)
            }
        
        }

        getNextNonce(library,account)

        const getNextNonceHandler = () => {
            getNextNonce(library,account);
        }

        library.on('block',getNextNonceHandler);

        return () => {
            stale = true;
            setNextNonce(undefined);
        }
    },[account,library,chainId])

    return (
        <div>
            Next Nonce : {nextNonce}
        </div>
    ) 

}

const StyleWalletStatusDiv = styled.div`
    display: flex;
    gap: 20px;
`

export function WalletStatus() {
    return (
        <StyleWalletStatusDiv>
            <ChainId />
            <BlockNumber />
            <Account />
            <Balance />
            <NextNonce />

        </StyleWalletStatusDiv>
    )
}