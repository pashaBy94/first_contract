import "@stdlib/deploy";

message Deposit{
    amount: Int as uint32;
    queryId: Int as uint32;
}
message WithDraw{
    amount: Int as uint32;
    target: Address;
}

contract Company with Deployable {
    balance: Int as uint256;
    init(){
        self.balance = 0;
    }
    receive(msg: Deposit){
            self.balance = msg.amount + self.balance;
        }

    get fun balance(): Int{
        return self.balance;
    }
}
