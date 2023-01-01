import { useWeb3React } from "@web3-react/core";
import { injected } from "./connectors";
import { useEffect, useState, useCallback } from "react";

export function useWeb3Connect() {
    const {activate, active} = useWeb3React();
    const [tried,setTried] = useState(false);


    const tryActivate = useCallback(  () => {
        async function _tryActivate() {
            try {
                await activate(injected,undefined,true);
            } catch (error) {
                window.alert('Error: '+(error && error.message))
            }
            setTried(true)
        }
        _tryActivate()
    },[activate])

    useEffect(()=> {
        tryActivate()
    }, [tryActivate])

    useEffect(()=>{
        if(!tried && active) {
            setTried(true)
        }
    },[tried,active])

    return tried;
}

export function useInactiveListener(flag = false) {
    const {active,error,activate} = useWeb3React()

    useEffect(()=>{
        const {ethereum} = window;
        if (ethereum && ethereum.on && !active && !error && !flag) {
            const handleConnect = () => {
                console.log('connect event')
                activate(injected);
            }

            const handleChainChanged = () => {
                console.log('chainChanged', chainId)
                activate(injected);

            }

            const handleAccountsChanged = () => {
                console.log('accountsChanged',accounts)
                if(accounts.length > 0) {
                    activate(injected)
                }

            }

            ethereum.on('connect',handleConnect)
            ethereum.on('chainChanged',handleChainChanged)
            ethereum.on('accountsChanged',handleAccountsChanged)

            return () => {
                if(ethereum.removeListner) {
                    ethereum.removeListner('connect',handleConnect)
                    ethereum.removeListner('chainChanged',handleChainChanged)
                    ethereum.removeListner('accountsChanged',handleAccountsChanged)
                }
            }
        }


    },[active,error,flag,activate])

}