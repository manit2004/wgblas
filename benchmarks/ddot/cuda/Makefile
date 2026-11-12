CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/ddot

$(BIN):
	mkdir -p $(BIN)

$(BIN)/ddot: ddot.c $(HDRS) | $(BIN)
	$(CC) ddot.c -o $(BIN)/ddot -lcublas

clean:
	rm -rf $(BIN)
