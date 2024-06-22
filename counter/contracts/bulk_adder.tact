import "@stdlib/deploy";

message Query {
    target: Int as uint32;
    recipient: Address;
}
message CounterValue {
    amount: Int as  uint32;
}
contract BulkAdder with Deployable {
    target: Int as uint32; 
    init() {
        self.target = 0;
    }
    receive(msg: Query){
        self.target = msg.target;
        send(SendParameters{
            to: msg.recipient,
            value: 0,
            mode: SendRemainingValue + SendIgnoreErrors,
            body: "queryCounter".asComment()
        });
    }
    receive(msg: CounterValue){
        require(msg.amount < 10, "helllo");
        if(self.target > msg.amount){
            send(SendParameters{
                to: sender(),
                value: 0,
                mode: SendRemainingValue + SendIgnoreErrors,
                body: "increment".asComment()
            });
        }
    }
}
