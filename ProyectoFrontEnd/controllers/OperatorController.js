export class OperatorController {
    constructor(usersRepository, bookingsRepository) {
        this.users = usersRepository;
        this.bookings = bookingsRepository;
    }
}