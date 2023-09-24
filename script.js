let pyodide=0
async function main(){
  pyodide = await loadPyodide();
  await pyodide.loadPackage("numpy")
  const a=1
  
  pyodide.runPython(`
  import sys
  sys.version
  import numpy as np
  import copy

  def check_winner(player, placement) :
    board=0
    if isinstance(placement, str):
      board=np.array([["" for _ in range(3)] for _ in range(3)])
      for i in range(9):
        board[i//3][i%3]=placement[i] if placement[i]!=' ' else ''
    else:board=placement
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

  def calcul(placement, fplay, alphabeta, deep=0):
    #quand on appel depuis le JS, placement est un string étant une suite des caractères presents sur le plateau
    tab=None
    if isinstance(placement, str): 
        tab=np.array([["" for _ in range(3)] for _ in range(3)])
        for i in range(9):
            tab[i//3][i%3]=placement[i] if placement[i]!=' ' else ''
    else: 
        tab=placement
        
        
    
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
            #for i in enfants: print(i[0], i[1])
            temp=max(enfants, key=lambda i:i[1])[0]
            for i in range(9):
                if temp[i//3][i%3]!=tab[i//3][i%3]: 
                    return i

        elif fplay=='O': return max(enfants, key=lambda i:i[1])
        else: return min(enfants, key=lambda i:i[1])
  `);

  //pyodide.runPython("print("+a+")");
}
main();


function check_winner(player, placement){
  let test = pyodide;

  return test.runPython('check_winner('+"'"+player+"'"+', '+"'"+placement+"'"+')');
}

function calcul(player, placement){
  
  let requete='calcul('+"'"+placement+"', '"+player+"'"+', 10)'
  let test =     pyodide;
  const res=test.runPython(requete)
  return res;
}

function maFonction(){
  const celluleCliquee = event.target;
  
  // Vous pouvez maintenant accéder aux propriétés ou aux attributs de la cellule
  const number = celluleCliquee.getAttribute('number');
  const status = celluleCliquee.textContent;

  if (status=='' && finish==false)
  {
    celluleCliquee.textContent="X"
    let placement=''
    tab[number]='X'
    for(let i=0; i<9; i++)
    {

      if (df[i].textContent=='')
      {
        placement+=' '
      }

      else
      {
        placement+=df[i].textContent
      }
    }   
    
    if (check_winner('X', placement)==true)
    {
        finish=true
        setTimeout(function() {
          alert('Le joueur X a gagné!');
        }, 0);
        //alert('Le joueur X a gagné!')
    }
    else if (tab.every(i => i!=''))
    {
        finish=true
        setTimeout(function() {
          alert('Egalite!');
        }, 0);
        //alert('Egalite!')
    }
    else //au tour du joueur O
    {   
        const a=calcul('O', placement)
        df[a].textContent='O'
        tab[a]='O'
        placement=placement.slice(0, a) +'O' +placement.slice(a+1)
    }
    if (check_winner('O', placement)==true && finish==false)
    {
        finish=true
        setTimeout(function() {
          alert('Le joueur O a gagné!');
        }, 0);
        //alert('Le joueur O a gagné!')
    }
    else if (tab.every(i => i!='') && finish ==false)
    {
        finish=true
        setTimeout(function() {
          alert('Egalite!');
        }, 0);
        //alert('Egalite!')
    }
  }
}
function startGame()
{
    commence=getRandomInt(2)
    finish=false
    for(let i=0; i<9; i++)
    {
      df[i].textContent=''
      tab[i]=''
    }
    if (commence==0)
    {
      const premier=getRandomInt(9)
      //const premier=calcul('O', '         ')
      df[premier].textContent='O'
      tab[premier]='O'
    }
}
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
const df = document.querySelectorAll('[data-cell]');
const tab = Array(9).fill('');
let finish=false
window.addEventListener("load", function () {
  // Sélectionnez l'élément de l'écran de chargement
  var loader = document.querySelector(".loader");

  // Masquez l'écran de chargement
  loader.style.display = "none";
});
