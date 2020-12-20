pragma solidity 0.6.2;

contract SponsorAdvertising {
    address public sponsor;
    address payable public contentCreatorWallet;
    enum State {INITIAL, CHANNEL_WAITING, VIDEO_WAITING, APPROVE}

    State public currentState;
    string public channelLink;
    string public videoLink;

    struct Advertisement {
        string name;
        string description;
        uint256 paymentPerThousandViews;
    }

    Advertisement public advertisement;

    modifier onlySponsor() {
        require(msg.sender == sponsor);
        _;
    }

    modifier onlyContentCreator() {
        require(msg.sender == contentCreatorWallet);
        _;
    }

    modifier onlyInitialState() {
        require(currentState == State.INITIAL);
        _;
    }

    modifier onlyChannelWaitingState() {
        require(currentState == State.CHANNEL_WAITING);
        _;
    }

    modifier onlyVideoWaitingState() {
        require(currentState == State.VIDEO_WAITING);
        _;
    }

    constructor(
        string memory _name,
        string memory _description,
        uint256 _paymentPerThousandViews
    ) public {
        sponsor = msg.sender;
        currentState = State.INITIAL;
        advertisement = Advertisement(
            _name,
            _description,
            _paymentPerThousandViews
        );
    }

    function addChannelLink(string memory _channelLink)
        public
        onlyInitialState
    {
        channelLink = _channelLink;
        currentState = State.CHANNEL_WAITING;
        contentCreatorWallet = msg.sender;
    }

    function approveChannel() public onlySponsor onlyChannelWaitingState {
        currentState = State.VIDEO_WAITING;
    }

    function rejectChannel() public onlySponsor onlyChannelWaitingState {
        channelLink = "";
        contentCreatorWallet = address(0x0);
        currentState = State.INITIAL;
    }

    function addVideoLink(string memory _videoLink)
        public
        onlyContentCreator
        onlyVideoWaitingState
    {
        videoLink = _videoLink;
        currentState = State.VIDEO_WAITING;
    }

    function approveVideo() public onlySponsor onlyVideoWaitingState {
        currentState = State.APPROVE;
    }

    function rejectVideo() public onlySponsor onlyVideoWaitingState {
        currentState = State.VIDEO_WAITING;
    }
}
