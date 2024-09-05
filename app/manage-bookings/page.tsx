import Footer from "../_components/footer";
import Header from "../_components/header";
import { db } from "../_lib/prisma";
import FormBookingProvider from "../_providers/form-booking";

const ManageBookingsPage = async () => {
    const services = await db.barbershopService.findMany();
    const users = await db.user.findMany();

    return (
        <>
            <Header />
            <FormBookingProvider services={services} users={users} />
            <Footer />
        </>
    );
}

export default ManageBookingsPage;