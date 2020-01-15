Project Link: https://adise19-tictactoe.herokuapp.com/

           Tic Tac Toe


    -Developers:  - Nikos Mozas
                  - Dimitris Filippidis


Η εφαρμογή Tic Tac Toe λειτουργεί με δυο παίκτες που παίζουν μέσα απο τον browser
Στην αρχική οθόνη οι 2 παίκτες εισάγουν το Username τους
Αφου πατήσουν Login ξεκινάει το παιχνίδι.
Μολις βγεί κάποιος νικητής, το παιχνίδι λήγει και εμφανίζεται το κατάλληλο μηνυμα του παικτη που κερδισε 
    
    
             Documentation

Το παιχνιδι χρησιμοποιει WebSockets για ταυτοχρονη επικοινωνια μεταξυ Server και client 

      Client:

      socket.on                 parameters           result
      =========                 ==========           ======
      displayUsername           uname                Δειχνει τα Usernames των παικτων
      inputApproved             squareId             Ελέγχει αν το input του χρήστη είναι νόμιμο
      oppInput                  squareId             Καταχωρεί το input του αντιπάλου
      setSymbol                 playerSymbol         Ελεγχει ποιος απο τους δυο παικτες εκανε Login πρωτος εχει το 'Χ' ενω ο δευτερος εχει το 'Ο'
      reload                       -                 Αν εχουν ηδη συνδεθει οι δυο παικτες (max) εμφανιζει το καταλληλο μηνυμα
      win                       winner               Μετα την ανακοινωση του νικητη, η σελιδα ανανεωνεται και βρισκομαστε παλι στην αρχικη οθονη
            

	  Server:

      socket.on                 parameters           result
      =========                 ==========           ======
	  login                      uname               Συνδέει τους χρήστες στο παιχνίδι.
	  input           {arr, playerSymbol, squareId}  Καταχωρεί το input του κάθε παίκτη (Θέση και σύμβολο).
	  disconnect                                     Διαγράφει την πρόοδο του παιχνιδιού αν καποιος παικτης αποχωρησει.

     Node.js Modules used:

     - express.js
     - socket.io
     - mysql