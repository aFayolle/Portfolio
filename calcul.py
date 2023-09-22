"""
import numpy as np
import copy

def calcul(placement, fplay, alphabeta, deep=0):
    #quand on appel depuis le JS, placement est un string étant une suite de chiffre donnant les placements de chaque pions dans l'ordre chronologique
    tab=None
    if isinstance(placement, str): 
        tab=np.array([["" for _ in range(3)] for _ in range(3)])
        for i in range(9):
            tab[i//3][i%3]=placement[i] if placement[i]!=' ' else ''
    else: tab=placement
    
    enfants=[]
    verif=True
    if check_winner('O', tab): return (0, 1)
    elif check_winner('X', tab): return (0, -1)
    val=0
    for i in range(9):
        if tab[i//3, i%3]=="":
            if verif:
                if i==0:
                     val=-10 if fplay=='O' else 10     
                temp=copy.deepcopy(tab)
                temp[i//3, i%3]=fplay
                fplay = "X" if fplay == "O" else "O"
                res=calcul(temp, fplay, val, deep+1)[1]
                fplay = "X" if fplay == "O" else "O"
                if fplay=='X' and res<val: 
                    val=res
                if fplay=='O' and res>val: 
                    val=res
                if fplay=='X' and res<alphabeta: 
                    verif=False
                if fplay=='O' and res>alphabeta: 
                    verif=False
                enfants.append((temp, res))

    if len (enfants)==0:
        if check_winner('O', tab): return (0, 1)
        elif check_winner('X', tab): return (0, -1)
        else: return (0, 0)
    else: 
        if deep==0:
            for i in range(9):
                tab=max(enfants, key=lambda i:i[1])[0]
                if placement[i//3][i%3]!=tab[i//3][i%3]: return i

        elif fplay=='O': return max(enfants, key=lambda i:i[1])
        else: return min(enfants, key=lambda i:i[1])


def check_winner(player, placement):
    board=np.array([["" for _ in range(3)] for _ in range(3)])
    for i in range(9):
        board[i//3][i%3]=placement[i] if placement[i]!=' ' else ''
    if player==board[1, 1]:
        if (player== board[0, 0] and player== board[2, 2]) or (player== board[2, 0] and player== board[0, 2]) or (player== board[1, 0] and player== board[1, 2]) or (player== board[0, 1] and player== board[2, 1]):
            return True
    if player==board[0, 0] and player==board[0, 1] and player==board[0, 2]:
        return True
    if player==board[2, 0] and player==board[2, 1] and player==board[2, 2]:
        return True
    if player==board[0, 0] and player==board[1, 0] and player==board[2, 0]:
        return True
    if player==board[0, 2] and player==board[1, 2] and player==board[2, 2]:
        return True
    return False
"""