import "@stdlib/deploy";

message Deposit{
    amount: Int as uint32;
}
message WithDraw{
    amount: Int as uint32;
    target: Address;
}

contract Fond with Deployable {
    balance: Int as uint256;
    init(){
        self.balance = 10;
    }
    receive(){
        throw(111);
    }
    receive(msg: Deposit){
        self.balance = msg.amount + self.balance;
    }
    receive(msg: WithDraw){
        let summ:Int = self.balance - msg.amount;
        require(self.balance > msg.amount, "");
        self.balance = summ;
        send(SendParameters{
            to: msg.target,
            value: 0,
            mode: SendRemainingValue + SendIgnoreErrors,
            body: Deposit{amount: msg.amount}.toCell()
        });

    }
    bounced(msg: Deposit){
        self.balance = self.balance + msg.amount;
    }
    get fun balance(): Int{
        return self.balance;
    }
}
