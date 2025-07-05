// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../contracts/SkillToken.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        SkillToken skillToken = new SkillToken();
        
        console.log("SkillToken deployed to:", address(skillToken));
        
        vm.stopBroadcast();
    }
}
