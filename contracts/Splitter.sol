pragma solidity ^0.4.24;

contract Splitter {
    mapping(address => uint) public balances;

    event LogSplit(
        address indexed from,
        address indexed toFirstRecipient,
        address indexed toSecondRecipient,
        uint amount
    );
    event LogWithdraw(address indexed from, uint amount);

    function acceptableRecipients(
        address toFirstRecipient,
        address toSecondRecipient
    ) private view returns (bool isAcceptable) {
        require(toFirstRecipient != toSecondRecipient, "Invalid Recipient");
        require(
            toFirstRecipient != address(0),
            "Missing first recipient's address"
        );
        require(
            toSecondRecipient != address(0),
            "Missing second recipient's address"
        );
        require(
            toFirstRecipient != msg.sender && toSecondRecipient != msg.sender,
            "Invalid Address"
        );

        return true;
    }

    function hasValue(uint value) private pure returns (bool) {
        require(value > 0, "msg.value equal 0");

        return true;
    }

    function split(address first, address second) public payable returns (bool) {
        hasValue(msg.value);
        acceptableRecipients(first, second);

        uint256 half = msg.value / 2;

        balances[first] = balances[first] + half;
        balances[second] = balances[second] + half;

        emit LogSplit(msg.sender, first, second, half);

        return true;
    }

    function withdraw() public returns (bool) {
        uint amount = balances[msg.sender];

        require(amount > 0, "Nothing to withdraw, amount equals 0");

        balances[msg.sender] = 0;
        msg.sender.transfer(amount);

        emit LogWithdraw(msg.sender, amount);

        return true;
    }
}
