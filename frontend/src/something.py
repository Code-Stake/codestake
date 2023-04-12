# Pre Processing
from typing import List



# Code
from typing import Optional

class ListNode:
	def __init__(self, val=0, next=None):
		self.val = val
		self.next = next

class Solution:
	def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
		

# Post Processing
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
    
        
# Post Processing Addition Code Blocks
def test1():
    masterSolutionInput = Master.createLinkedList([1, 2, 3, 4, 5])
    userSolutionInput = Master.createLinkedList([1, 2, 3, 4, 5])
    return Master.compareLinkedLists(Master.solution(any, masterSolutionInput), Solution.reverseList(any,userSolutionInput))


# Test case 2
def test2():
    masterSolutionInput = Master.createLinkedList([1, 2, 3, None, None, None, 7, 8, 9, 10])
    userSolutionInput = Master.createLinkedList([1, 2, 3, None, None, None, 7, 8, 9, 10])
    
    return Master.compareLinkedLists(Master.solution(any,masterSolutionInput), Solution.reverseList(any,userSolutionInput))


# Test case 3
def test3():
    masterSolutionInput = Master.createLinkedList([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100])
    userSolutionInput = Master.createLinkedList([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100])
    return Master.compareLinkedLists(Master.solution(any,masterSolutionInput), Solution.reverseList(any,userSolutionInput))
