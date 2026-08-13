CC = nvcc
BIN = bin

all: $(BIN)/idamax $(BIN)/stride.idamax

$(BIN):
	mkdir -p $(BIN)

$(BIN)/idamax: idamax.c ../../utils/helpers.h | $(BIN)
	$(CC) idamax.c -o $(BIN)/idamax -lcublas

$(BIN)/stride.idamax: stride.idamax.c ../../utils/helpers.h | $(BIN)
	$(CC) stride.idamax.c -o $(BIN)/stride.idamax -lcublas

clean:
	rm -rf $(BIN)
