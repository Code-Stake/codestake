class Master:
    # printLinkedList(ListNode(1, ListNode(2, ListNode(3)))) -> 1 -> 2 -> 3 -> None
    def printLinkedList(head: Optional[ListNode]) -> None:
        curr = head
        while curr:
            print(curr.val, end=" -> ")
            curr = curr.next
        print("None")
    
    # compareLinkedLists(ListNode(1, ListNode(2, ListNode(3))), ListNode(1, ListNode(2, ListNode(3)))) -> True
    def compareLinkedLists(head1: Optional[ListNode], head2: Optional[ListNode]) -> bool:
        while head1 and head2:
            if head1.val != head2.val:
                return False
            head1 = head1.next
            head2 = head2.next
        return head1 == head2
    
    # createLinkedList([1, 2, 3]) -> ListNode(1, ListNode(2, ListNode(3)))
    def createLinkedList(arr: List[int]) -> Optional[ListNode]:
        if not arr:
            return None
        head = ListNode(arr[0])
        curr = head
        for i in range(1, len(arr)):
            curr.next = ListNode(arr[i])
            curr = curr.next
        return head

    # solution(ListNode(1, ListNode(2, ListNode(3))) --> ListNode(3, ListNode(2, ListNode(1)))
    def solution(self, head: Optional[ListNode]) -> Optional[ListNode]:
        prev = None
        curr = head
        while curr:
            nxt = curr.next
            curr.next = prev
            prev = curr
            curr = nxt
        return prev