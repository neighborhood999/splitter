pragma solidity ^0.4.24;

contract Splitter {
    mapping(address => uint) public balances;

    event LogSplit(
        address indexed from,
        address indexed recipient1,
        address indexed recipient2,
        uint amount
    );
    event LogWithdraw(address indexed from, uint amount);

    function areAcceptable(
        address recipient1,
        address recipient2
    ) public view returns (bool isAcceptable) {
        require(recipient1 != recipient2, "Invalid Recipient");
        require(
            recipient1 != address(0),
            "Missing first recipient's address"
        );
        require(
            recipient2 != address(0),
            "Missing second recipient's address"
        );
        require(
            recipient1 != msg.sender && recipient2 != msg.sender,
            "Invalid Address"
        );

        return true;
    }

    function hasValue(uint value) private pure returns (bool) {
        require(value > 0, "msg.value equal 0");

        return true;
    }

    function split(address first, address second) public payable returns (bool) {
        require(hasValue(msg.value), "msg.value require > 0");
        require(areAcceptable(first, second), "Recipient required");

        uint256 half = msg.value / 2;
        uint256 remainder = msg.value % 2;

        balances[first] = balances[first] + half;
        balances[second] = balances[second] + half;

        if (remainder > 0) {
            balances[msg.sender] = balances[msg.sender] + remainder;
        }

        emit LogSplit(msg.sender, first, second, half);

        return true;
    }

    function withdraw() public returns (bool) {
        uint amount = balances[msg.sender];

        require(amount > 0, "Nothing to withdraw, amount equals 0");

        balances[msg.sender] = 0;
        emit LogWithdraw(msg.sender, amount);
        msg.sender.transfer(amount);

        return true;
    }
}
