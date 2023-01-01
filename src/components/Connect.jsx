import { useWeb3React } from "@web3-react/core"
import { useState } from "react"
import { injected } from "../utils/connectors";
import styled from 'styled-components';


const StyledActivateButton = styled.button`
    width: 150px;
    height: 2rem;
    border-radius: 1rem;
    border-color: green;
    cursor: pointer;
`

const StyledDeactivateButton = styled.button`
    width: 150px;
    height: 2rem;
    border-radius: 1rem;
    border-color: red;
    cursor: pointer;
`

function Activate() {
    const{activate, active} = useWeb3React()

    const [activating,setActivating] = useState(false);

    function handleActive(event) {
        event.preventDefault();

        async function _activate(activate) {
            setActivating(true)
            await activate(injected);
            setActivating(false)
        }
        _activate(activate)
    }

    return (
        <StyledActivateButton disabled={active} onClick={handleActive}>Connect</StyledActivateButton>
    )
}

function Deactivate() {
    const {deactivate,active} = useWeb3React()

    function handleDeactivate(event) {
        event.preventDefault();

        deactivate()
    }

    return (
        <StyledDeactivateButton disabled={!active} onClick={handleDeactivate}>Disconnect</StyledDeactivateButton>
    )

}

export function Connect() {
    const context = useWeb3React();
    if(context.error) {
        window.alert(context.error);
    }

    return (
        <div>
            <Activate />
            <Deactivate />
        </div>
    )
}