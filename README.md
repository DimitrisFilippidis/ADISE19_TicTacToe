      Project Link: https://adise19-tictactoe.herokuapp.com/

           Tic Tac Toe


    -Developers:  - Nikos Mozas
                  - Dimitris Filippidis


Η εφαρμογή Tic Tac Toe λειτουργεί με δυο παίκτες που παίζουν μέσα απο τον browser
Στην αρχική οθόνη οι 2 παίκτες εισάγουν το Username τους
Αφου πατήσουν Login ξεκινάει το παιχνίδι.
Μολις βγεί κάποιος νικητής, το παιχνίδι λήγει και εμφανίζεται το κατάλληλο μηνυμα του παικτη που κερδισε 
    
    
             Documentation

Το παιχνίδι χρησιμοποιεί WebSockets για ταυτόχρονη επικοινωνία μεταξύ Server και client


      Client:

      socket.on                 parameters           result
      =========                 ==========           ======
      displayUsername           uname                Δείχνει τα Usernames των παικτών
      inputApproved             squareId             Ελέγχει αν το input του χρήστη είναι νόμιμο
      oppInput                  squareId             Καταχωρεί το input του αντιπάλου
      setSymbol                 playerSymbol         Ελεγχει ποιος απο τους δυο παικτες εκανε Login πρώτος έχει το 'Χ' ενω ο δεύτερος έχει το 'Ο'
      reload                       -                 Αν έχουν ήδη συνδεθεί οι δόο παίκτες (max) εμφανίζει το κατάλληλο μήνυμα
      win                       winner               Μετά την ανακοίνωση του νικητή, η σελίδα ανανεώνεται και βρισκόμαστε πάλι στην αρχική οθόνη
            

	  Server:

      socket.on                 parameters           result
      =========                 ==========           ======
	  login                      uname               Συνδέει τους χρήστες στο παιχνίδι.
	  input           {arr, playerSymbol, squareId}  Καταχωρεί το input του κάθε παίκτη (Θέση και σύμβολο).
	  disconnect                   -                 Διαγράφει την πρόοδο του παιχνιδιού αν καποιος παίκτης αποχωρήσει.

     Node.js Modules used:

     - express.js
     - socket.io
     - mysql