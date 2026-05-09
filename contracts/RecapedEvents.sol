// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title RecapedEvents
/// @notice Stores event creation, joins, attendance verification, organizer
///         approval, and skill badge claims for the Recaped demo dApp.
contract RecapedEvents {
    struct EventInfo {
        uint256 id;
        address organizer;
        string title;
        string description;
        string category;
        string materialsURI;
        string eventCodeHash;
        uint256 capacity;
        uint256 attendeeCount;
        uint256 startTime;
        bool closed;
    }

    struct Attendee {
        bool joined;
        bool verificationSubmitted;
        bool approved;
        bool badgeClaimed;
        string verificationURI;
    }

    uint256 public nextEventId = 1;
    mapping(uint256 => EventInfo) public events;
    mapping(uint256 => mapping(address => Attendee)) public attendees;
    mapping(address => uint256[]) private userEvents;

    event EventCreated(
        uint256 indexed eventId,
        address indexed organizer,
        string title,
        string category
    );
    event EventJoined(uint256 indexed eventId, address indexed attendee);
    event AttendanceVerificationSubmitted(
        uint256 indexed eventId,
        address indexed attendee,
        string verificationURI
    );
    event AttendanceApproved(uint256 indexed eventId, address indexed attendee);
    event SkillBadgeClaimed(uint256 indexed eventId, address indexed attendee);

    modifier validEvent(uint256 eventId) {
        require(eventId > 0 && eventId < nextEventId, "Invalid event ID");
        _;
    }

    function createEvent(
        string calldata title,
        string calldata description,
        string calldata category,
        string calldata materialsURI,
        string calldata eventCodeHash,
        uint256 capacity,
        uint256 startTime
    ) external returns (uint256) {
        require(bytes(title).length > 0, "Title required");
        require(bytes(materialsURI).length > 0, "Materials URI required");
        require(capacity > 0, "Capacity must be > 0");

        uint256 id = nextEventId++;
        events[id] = EventInfo({
            id: id,
            organizer: msg.sender,
            title: title,
            description: description,
            category: category,
            materialsURI: materialsURI,
            eventCodeHash: eventCodeHash,
            capacity: capacity,
            attendeeCount: 0,
            startTime: startTime,
            closed: false
        });

        emit EventCreated(id, msg.sender, title, category);
        return id;
    }

    function joinEvent(uint256 eventId) external validEvent(eventId) {
        EventInfo storage info = events[eventId];
        Attendee storage a = attendees[eventId][msg.sender];
        require(!a.joined, "Already joined");
        require(info.attendeeCount < info.capacity, "Event full");

        a.joined = true;
        info.attendeeCount += 1;
        userEvents[msg.sender].push(eventId);

        emit EventJoined(eventId, msg.sender);
    }

    function submitAttendanceVerification(
        uint256 eventId,
        string calldata verificationURI
    ) external validEvent(eventId) {
        Attendee storage a = attendees[eventId][msg.sender];
        require(a.joined, "Not joined");
        require(bytes(verificationURI).length > 0, "Verification URI required");
        require(!a.verificationSubmitted, "Already submitted");

        a.verificationSubmitted = true;
        a.verificationURI = verificationURI;

        emit AttendanceVerificationSubmitted(eventId, msg.sender, verificationURI);
    }

    function approveAttendance(uint256 eventId, address attendee)
        external
        validEvent(eventId)
    {
        EventInfo storage info = events[eventId];
        require(msg.sender == info.organizer, "Only organizer");
        Attendee storage a = attendees[eventId][attendee];
        require(a.joined, "Not an attendee");
        require(a.verificationSubmitted, "Verification not submitted");
        require(!a.approved, "Already approved");

        a.approved = true;
        emit AttendanceApproved(eventId, attendee);
    }

    function claimSkillBadge(uint256 eventId) external validEvent(eventId) {
        Attendee storage a = attendees[eventId][msg.sender];
        require(a.approved, "Not approved");
        require(!a.badgeClaimed, "Already claimed");

        a.badgeClaimed = true;
        emit SkillBadgeClaimed(eventId, msg.sender);
    }

    function getEvent(uint256 eventId)
        external
        view
        validEvent(eventId)
        returns (EventInfo memory)
    {
        return events[eventId];
    }

    function getUserEventIds(address user) external view returns (uint256[] memory) {
        return userEvents[user];
    }

    function getAttendeeStatus(uint256 eventId, address user)
        external
        view
        returns (Attendee memory)
    {
        return attendees[eventId][user];
    }

    function hasJoined(uint256 eventId, address user) external view returns (bool) {
        return attendees[eventId][user].joined;
    }

    function hasVerifiedAttendance(uint256 eventId, address user)
        external
        view
        returns (bool)
    {
        return attendees[eventId][user].verificationSubmitted;
    }

    function hasClaimedBadge(uint256 eventId, address user)
        external
        view
        returns (bool)
    {
        return attendees[eventId][user].badgeClaimed;
    }
}
