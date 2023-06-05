pragma solidity ^0.4.17;

contract Lottery {
    // 管理者地址
    address public manager;
    address[] public players;

    function Lottery() public {
        // 调用者地址
        manager = msg.sender;
    }

    function enter() public payable  {
        require(msg.value > .01 ether);

        players.push(msg.sender);
    }

    function random() private view returns (uint) {
        // block difficulty 块时间
        // now 当前时间
        return uint(keccak256(block.difficulty, now, players));
    }

    function pickWinner() public restricted restetingPlayers {
        uint index = random() % players.length;
        // balance 当前合约可用余额
        // transfer 从当前合同中提取资金并将其发送到给定的地址
        players[index].transfer(this.balance);   
    }

    modifier restricted() {
        // 只有管理者可以调用被修饰函数
        require(msg.sender == manager);
        _;
    }

    modifier restetingPlayers() {
        _;
        players = new address[](0);
    }

    // 获取所有参加游戏的用户
    function getPlayers() public view returns (address[]) {
        return players;
    }


    // 取消这场游戏，将钱退回给用户
    function returnEntries() public restricted restetingPlayers  {
        for (uint i = 0; i <= players.length; i++) {
            players[i].transfer(this.balance);
        }
    }
}