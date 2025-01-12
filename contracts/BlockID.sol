// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BlockID {
    struct Identity {
        string name;
        string email;
        uint256 birthDate;
        bool isRegistered;
    }

    mapping(address => Identity) public identities;

    event IdentityRegistered(address indexed user, string name, string email);
    event IdentityUpdated(address indexed user, string name, string email);
    event IdentityRevoked(address indexed user);

    function registerIdentity(string memory _name, string memory _email, uint256 _birthDate) public {
        require(!identities[msg.sender].isRegistered, "Identity already registered");
        
        identities[msg.sender] = Identity(_name, _email, _birthDate, true);

        emit IdentityRegistered(msg.sender, _name, _email);
    }

    function updateIdentity(string memory _name, string memory _email, uint256 _birthDate) public {
        require(identities[msg.sender].isRegistered, "Identity not registered");

        identities[msg.sender] = Identity(_name, _email, _birthDate, true);

        emit IdentityUpdated(msg.sender, _name, _email);
    }

    function revokeIdentity() public {
        require(identities[msg.sender].isRegistered, "Identity not registered");

        delete identities[msg.sender];

        emit IdentityRevoked(msg.sender);
    }

    function getIdentity(address _user) public view returns (string memory, string memory, uint256) {
        require(identities[_user].isRegistered, "Identity not registered");

        return (
            identities[_user].name,
            identities[_user].email,
            identities[_user].birthDate
        );
    }
}
